'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header, BlogCard, SearchBar } from '@/components'
import { getUserPosts, deletePost } from '@/lib/postService'
import { Button } from '@/components/ui'
import { Modal } from '@/components'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [blogs, setBlogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, postId: null, message: '', onConfirm: null })

  useEffect(() => {
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
  }, [])

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  const filtered = blogs.filter(b => b?.title?.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleDeleteClick = (id) => {
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
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <SearchBar setSearchTerm={setSearchTerm} />
      <section className="home px-4 py-6">
        {filtered.length > 0 ? (
          filtered.map(blog => blog && <BlogCard key={blog._id} blog={blog} onDelete={handleDeleteClick} />)
        ) : (
          <div className="flex justify-center">
            <Button variant="special" className="mt-40">
              <Link href="/create">CREATE NEW BLOG</Link>
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
