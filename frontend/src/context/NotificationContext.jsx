import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const NotificationContext = createContext()

export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }) => {

  const [notifications, setNotifications] = useState([])
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = io('http://localhost:3000')
    socketRef.current = socket

    // join rooms for any orders already stored in localStorage
    const orderIds = JSON.parse(localStorage.getItem('orderIds') || '[]')
    orderIds.forEach(id => socket.emit('join:order', id))

    // item(s) ready in user's order
    socket.on('order:updated', (updatedOrder) => {
      window.dispatchEvent(new CustomEvent('serveease:order:updated', { detail: updatedOrder }))

      const readyItems = updatedOrder.items.filter(i => i.status === 'ready')

      if (updatedOrder.status === 'ready') {
        addNotification({
          type: 'order_ready',
          message: 'Your order is ready for pickup!',
          sub: `Queue #${updatedOrder.queueNumber} · Pick up within 10 minutes`,
          orderId: updatedOrder._id
        })
      } else if (readyItems.length > 0) {
        const names = readyItems.map(i => i.name).join(', ')
        addNotification({
          type: 'item_ready',
          message: `${names} ${readyItems.length > 1 ? 'are' : 'is'} ready!`,
          sub: `Queue #${updatedOrder.queueNumber} · Pick up within 10 minutes`,
          orderId: updatedOrder._id
        })
      }
    })

    // item was not picked up — reassigned to someone else
    socket.on('order:item:reassigned', ({ order, itemName }) => {
      window.dispatchEvent(new CustomEvent('serveease:order:updated', { detail: order }))
      addNotification({
        type: 'reassigned',
        message: `Your ${itemName} was given to another customer`,
        sub: `Queue #${order.queueNumber} · You didn't pick it up in time`,
        orderId: order._id
      })
    })

    // user received a reassigned item from another order
    socket.on('order:item:received', ({ order, itemName, savedTime }) => {
      window.dispatchEvent(new CustomEvent('serveease:order:updated', { detail: order }))
      addNotification({
        type: 'received',
        message: `Your ${itemName} is ready now!`,
        sub: `Queue #${order.queueNumber} · Saved ~${savedTime} min wait`,
        orderId: order._id
      })
    })

    return () => socket.disconnect()
  }, [])

  const joinOrderRoom = (orderId) => {
    if (socketRef.current) socketRef.current.emit('join:order', orderId)
  }

  const addNotification = (notif) => {
    setNotifications(prev => [{
      id: `${Date.now()}-${Math.random()}`,
      ...notif,
      read: false,
      timestamp: new Date()
    }, ...prev])
  }

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, joinOrderRoom }}>
      {children}
    </NotificationContext.Provider>
  )
}
