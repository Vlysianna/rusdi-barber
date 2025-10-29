import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { authService } from '../../services/authService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  email: string;
  loading: boolean;
  success: boolean;
  error: string;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    loading: false,
    success: false,
    error: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.email) {
      setFormState(prev => ({
        ...prev,
        error: 'Email address is required',
      }));
      return;
    }

    if (!validateEmail(formState.email)) {
      setFormState(prev => ({
        ...prev,
        error: 'Please enter a valid email address',
      }));
      return;
    }

    setFormState(prev => ({
      ...prev,
      loading: true,
      error: '',
    }));

    try {
      await authService.forgotPassword(formState.email);
      setFormState(prev => ({
        ...prev,
        loading: false,
        success: true,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      setFormState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  const handleClose = () => {
    setFormState({
      email: '',
      loading: false,
      success: false,
      error: '',
    });
    onClose();
  };

  const handleBackToLogin = () => {
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      className="sm:max-w-md"
    >
      <Modal.Header onClose={handleClose} showCloseButton={!formState.loading}>
        <h3 className="text-lg font-medium text-gray-900">
          {formState.success ? 'Check Your Email' : 'Forgot Password'}
        </h3>
      </Modal.Header>

      <Modal.Body className="px-6 py-4">
        {formState.success ? (
          // Success State
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Reset Email Sent
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              We've sent a password reset link to{' '}
              <span className="font-medium">{formState.email}</span>
            </p>
            <p className="text-xs text-gray-500 mb-6">
              If you don't see the email in your inbox, please check your spam folder.
              The link will expire in 24 hours.
            </p>
            <Button
              onClick={handleBackToLogin}
              variant="primary"
              fullWidth
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Login
            </Button>
          </div>
        ) : (
          // Form State
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {formState.error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{formState.error}</p>
                    </div>
                  </div>
                </div>
              )}

              <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formState.email}
                  onChange={(e) =>
                    setFormState(prev => ({
                      ...prev,
                      email: e.target.value,
                      error: '',
                    }))
                  }
                  className={`
                    block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400
                    focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${formState.error ? 'border-red-300' : 'border-gray-300'}
                  `}
                  placeholder="Enter your email address"
                  disabled={formState.loading}
                />
              </div>
            </div>
          </form>
        )}
      </Modal.Body>

      {!formState.success && (
        <Modal.Footer>
          <div className="flex space-x-3 w-full">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={formState.loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formState.loading}
              onClick={handleSubmit}
              disabled={formState.loading}
              className="flex-1"
            >
              {formState.loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </div>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ForgotPasswordModal;
