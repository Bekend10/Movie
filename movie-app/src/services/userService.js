import { authApi } from './api'

/**
 * User Service
 * Handles user-related operations that require authentication
 */

const userService = {
  /**
   * Get user profile
   * @returns {Promise}
   */
  async getProfile() {
    const response = await authApi.get('/user/profile')
    return response
  },

  /**
   * Update user profile
   * @param {Object} data - Profile update data
   * @returns {Promise}
   */
  async updateProfile(data) {
    const response = await authApi.put('/user/profile', data)
    return response
  },

  /**
   * Upload user avatar
   * @param {File} file - Avatar image file
   * @returns {Promise}
   */
  async uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await authApi.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  },

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise}
   */
  async changePassword(currentPassword, newPassword) {
    const response = await authApi.post('/user/change-password', {
      currentPassword,
      newPassword
    })
    return response
  },

  /**
   * Get user preferences
   * @returns {Promise}
   */
  async getPreferences() {
    const response = await authApi.get('/user/preferences')
    return response
  },

  /**
   * Update user preferences
   * @param {Object} preferences - User preferences object
   * @returns {Promise}
   */
  async updatePreferences(preferences) {
    const response = await authApi.put('/user/preferences', preferences)
    return response
  },

  /**
   * Get user statistics
   * @returns {Promise}
   */
  async getStatistics() {
    const response = await authApi.get('/user/statistics')
    return response
  },

  /**
   * Delete user account
   * @param {string} password - User password for confirmation
   * @returns {Promise}
   */
  async deleteAccount(password) {
    const response = await authApi.delete('/user/account', {
      data: { password }
    })
    return response
  }
}

export default userService
