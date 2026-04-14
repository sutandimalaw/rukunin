'use client'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/provider/auth-provider'
import { profileApi } from '@/lib/api/profile'

export default function AccountForm() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [fullname, setFullname] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [website, setWebsite] = useState<string | null>(null)
    const [avatar_url, setAvatarUrl] = useState<string | null>(null)

    const getProfile = useCallback(async () => {
        try {
            setLoading(true)
            const data = await profileApi.get()
            setFullname(data.fullName)
            setUsername(data.username)
            setWebsite(data.website)
            setAvatarUrl(data.avatarUrl)
        } catch (error) {
            console.error('Error loading user data!', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        getProfile()
    }, [getProfile])

    async function updateProfile() {
        try {
            setLoading(true)
            await profileApi.update({
                fullName: fullname ?? undefined,
                username: username ?? undefined,
                website: website ?? undefined,
                avatarUrl: avatar_url ?? undefined,
            })
            alert('Profile updated!')
        } catch (error) {
            console.error('Error updating the data!', error)
            alert('Error updating the data!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="form-widget">
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={user?.email ?? ''} disabled />
            </div>
            <div>
                <label htmlFor="fullName">Full Name</label>
                <input
                    id="fullName"
                    type="text"
                    value={fullname || ''}
                    onChange={(e) => setFullname(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="website">Website</label>
                <input
                    id="website"
                    type="url"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>

            <div>
                <button
                    className="button primary block"
                    onClick={updateProfile}
                    disabled={loading}
                >
                    {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>
        </div>
    )
}
