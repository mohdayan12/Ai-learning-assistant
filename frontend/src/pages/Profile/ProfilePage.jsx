import React, { useState, useEffect } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import authService from '../../services/authService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import { useRef } from 'react'
import { User, Mail, Lock, Plus, Camera } from 'lucide-react'
import StarBackground from '../../components/common/StarBackground.jsx'


const ProfilePage = () => {

  const [loading, setLoading] = useState(true)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")

  const [profileImage, setProfileImage] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authService.getProfile();
        setUsername(data.username)
        setEmail(data.email)
      } catch (error) {
        toast.error("Failed to fetch profile data.")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      toast.error("New password does not match.")
      return
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 character long.")
      return
    }
    setPasswordLoading(true)
    try {
      await authService.changePassword({ currentPassword, newPassword })
      toast.success('Password change successfully!')
      setCurrentPassword("")
      setConfirmNewPassword("")
      setNewPassword("")
    } catch (error) {
      toast.error(error.message || 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  };

  if (loading) {
    return <Spinner />
  }

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {

      // In a real app, you would upload this file to your server here
      // For now, we'll just create a local object URL to p
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      toast.success("Profile image updated! (Preview)");
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Premium Dotted Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-position-[16px_16px] opacity-40 pointer-events-none dark:opacity-0 transition-opacity duration-300 -z-10" />
      <div className="absolute inset-0 opacity-40 dark:opacity-60">
        <StarBackground />
      </div>

      <div className="relative z-10">
        <PageHeader title='Profile Settings' />

        <div className="space-y-8 max-w-2xl mx-auto">
          {/* User Information Section */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 transition-colors duration-300">
            <div className="flex flex-col md:flex-row gap-8 items-center ">
              <div className="flex-1 w-full ">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center transition-colors duration-300">
                    <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight transition-colors duration-300">
                      User Information
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                      Manage your account credentials
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="group">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2 transition-colors duration-300">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors duration-200" />
                      </div>
                      <div className="w-full h-11 pl-11 pr-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 text-sm font-medium transition-colors duration-300 flex items-center">
                        {username}
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2 transition-colors duration-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors duration-200" />
                      </div>
                      <div className="w-full h-11 pl-11 pr-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 text-sm font-medium transition-colors duration-300 flex items-center">
                        {email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Picture Placeholder */}
              <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-auto pt-4 md:pt-0 md:pl-8 ">
                <div
                  className="relative group cursor-pointer mb-3"
                  onClick={handleImageClick}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="w-40 h-40 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 p-1 shadow-xl shadow-emerald-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 flex items-center justify-center overflow-hidden transition-colors duration-300 relative group-hover:border-emerald-100 dark:group-hover:border-emerald-900/30">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <span className="text-6xl font-black bg-clip-text text-transparent bg-linear-to-r from-emerald-500 to-teal-500 uppercase transition-transform duration-300 group-hover:scale-110">
                          {username ? username.charAt(0) : '?'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 w-10 h-10 bg-emerald-500 rounded-full border-[3px] border-white dark:border-slate-800 flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                    <Camera className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center transition-colors duration-300">
                <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight transition-colors duration-300">
                  Change Password
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                  Ensure your account is using a long, secure password
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div className="group">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2 transition-colors duration-300">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full h-11 pl-11 pr-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg focus:shadow-emerald-500/10"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2 transition-colors duration-300">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full h-11 pl-11 pr-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg focus:shadow-emerald-500/10"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2 transition-colors duration-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    className="w-full h-11 pl-11 pr-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg focus:shadow-emerald-500/10"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="group relative px-6 h-11 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-semibold text-white text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {passwordLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Changing...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
