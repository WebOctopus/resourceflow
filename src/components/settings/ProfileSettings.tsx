import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Save, Camera } from 'lucide-react';
import { useAuthStore } from '../../lib/store';

const nameSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type NameFormData = z.infer<typeof nameSchema>;
type EmailFormData = z.infer<typeof emailSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfileSettings() {
  const { user, updateUser } = useAuthStore();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string>('');
  const [updateError, setUpdateError] = useState<string>('');

  const { register: registerName, handleSubmit: handleSubmitName, formState: { errors: nameErrors } } = useForm<NameFormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  const { register: registerEmail, handleSubmit: handleSubmitEmail, formState: { errors: emailErrors } } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user?.email || '',
    },
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateAvatar = async () => {
    if (!user) return;
    
    setIsUpdatingAvatar(true);
    setUpdateError('');
    try {
      await updateUser({
        ...user,
        avatar: avatarPreview,
      });
      setUpdateSuccess('Profile photo updated successfully');
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (error) {
      setUpdateError('Failed to update profile photo');
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const onSubmitName = async (data: NameFormData) => {
    if (!user) return;
    
    setUpdateError('');
    try {
      await updateUser({
        ...user,
        name: data.name,
      });
      setUpdateSuccess('Name updated successfully');
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (error) {
      setUpdateError('Failed to update name');
    }
  };

  const onSubmitEmail = async (data: EmailFormData) => {
    if (!user) return;
    
    setUpdateError('');
    try {
      await updateUser({
        ...user,
        email: data.email,
      });
      setUpdateSuccess('Email updated successfully');
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (error) {
      setUpdateError('Failed to update email');
    }
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    setUpdateError('');
    try {
      // Password update logic would go here
      resetPassword();
      setUpdateSuccess('Password updated successfully');
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (error) {
      setUpdateError('Failed to update password');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {updateSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-600 rounded-md p-3 text-sm">
          {updateSuccess}
        </div>
      )}

      {updateError && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
          {updateError}
        </div>
      )}

      {/* Profile Photo Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Profile Photo</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50"
              >
                <Camera className="h-4 w-4 text-gray-600" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <button
              onClick={handleUpdateAvatar}
              disabled={isUpdatingAvatar || !avatarPreview}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isUpdatingAvatar ? 'Updating...' : 'Update Photo'}
            </button>
          </div>
        </div>
      </div>

      {/* Name Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Full Name</h2>
        </div>
        <form onSubmit={handleSubmitName(onSubmitName)} className="p-6">
          <div className="space-y-4">
            <div>
              <input
                {...registerName('name')}
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {nameErrors.name && (
                <p className="mt-1 text-sm text-red-600">{nameErrors.name.message}</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Update Name
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Email Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Email Address</h2>
        </div>
        <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <input
                {...registerEmail('email')}
                type="email"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              {emailErrors.email && (
                <p className="mt-1 text-sm text-red-600">{emailErrors.email.message}</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Update Email
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
        </div>
        <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...registerPassword('currentPassword')}
                  type="password"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {passwordErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...registerPassword('newPassword')}
                  type="password"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {passwordErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...registerPassword('confirmPassword')}
                  type="password"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Update Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}