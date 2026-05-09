'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header, BlogCard, SearchBar } from '@/components'
import { getUserPosts, deletePost } from '@/lib/postService'
import { ProgressBar } from '@/components/ui'
import { Button } from '@/components/ui'
import { Modal } from '@/components'
import { useFolders } from '@/contexts/FolderContext'
import { useSettings } from '@/contexts/SettingsContext'
import { useGuest } from '@/contexts/GuestContext'
import Link from 'next/link'

export default function FolderPage() {
  const { id } = useParams()
  const [blogs, setBlogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, postId: null, message: '', onConfirm: null })
  const { folders } = useFolders()
  const { settings } = useSettings()
  const { isGuest, guestPosts } = useGuest()

  const folder = folders.find(f => f.id === id)

  useEffect(() => {
    if (isGuest) { setLoading(false); return; }
    const fetchBlogs = async () => {
      try {
        const data = await getUserPosts()
        setBlogs(Array.isArray(data) ? data : [])
      } catch {
        setBlogs([])
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [isGuest])

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-white dark:bg-black/90">
      <div className="w-64"><ProgressBar height="h-2" /></div>
    </div>
  )

  const allBlogs = isGuest ? guestPosts : blogs

  const matchesSearch = (blog) => {
    const term = searchTerm.toLowerCase().replace(/^#/, '')
    const titleMatch = blog?.title?.toLowerCase().includes(term)
    const hashtagMatch = blog?.content?.toLowerCase().split(/\s+/).some(w => w.startsWith('#') && w.slice(1).includes(term))
    return titleMatch || hashtagMatch
  }

  const filtered = allBlogs
    .filter(b => folder?.postIds.includes(b._id))
    .filter(b => matchesSearch(b))
    .sort((a, b) =>
      settings.sortOrder === 'oldest'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    )

  const handleDeleteClick = (id) => {
    if (!settings.confirmDelete) {
      if (isGuest) return
      deletePost(id).then(() => setBlogs(prev => prev.filter(b => b._id !== id))).catch(() => alert('Failed to delete post'))
      return
    }
    setModal({
      open: true,
      postId: id,
      message: 'Are you sure you want to delete this post?',
      onConfirm: async () => {
        try {
          await deletePost(id)
          setBlogs(prev => prev.filter(b => b._id !== id))
        } catch {
          alert('Failed to delete post')
        }
        setModal({ open: false, postId: null, message: '', onConfirm: null })
      }
    })
  }

  const closeModal = () => setModal({ open: false, postId: null, message: '', onConfirm: null })

  return (
    <div className="min-h-screen bg-white dark:bg-black/90">
      <Header />
      <SearchBar setSearchTerm={setSearchTerm} />
      <section className="px-4 py-6">
        {filtered.length > 0 ? (
          filtered.map(blog => blog && (
            <BlogCard key={blog._id} blog={{ ...blog, folderId: id }} onDelete={handleDeleteClick} change={true} hideAction={true} notification={true} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-40 gap-4">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No jots in this folder</p>
            <Button variant="special">
              <Link href="/home">Go to Home</Link>
            </Button>
          </div>
        )}
      </section>

      {modal.open && (
        <Modal
          open={modal.open}
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={closeModal}
        />
      )}
    </div>
  )
}
