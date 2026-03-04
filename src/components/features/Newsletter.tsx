'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    setStatus('loading');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      setMessage('Thank you for subscribing! Check your email for confirmation.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay Updated
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Get the latest posts, tutorials, and insights delivered straight to your inbox. 
          No spam, unsubscribe anytime.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={status === 'loading'}
              />
            </div>
            <Button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-3 sm:px-12"
            >
              {status === 'loading' ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Subscribing...</span>
                </div>
              ) : (
                'Subscribe'
              )}
            </Button>
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
              <CheckCircle className="w-5 h-5" />
              <span>{message}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="w-5 h-5" />
              <span>{message}</span>
            </div>
          )}

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Join 1,000+ developers getting weekly updates.</p>
            <p className="mt-2">
              By subscribing, you agree to our{' '}
              <a href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/terms" className="underline hover:text-foreground">
                Terms of Service
              </a>.
            </p>
          </div>
        </form>
      </div>

      {/* Features */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold mb-2">Weekly Digest</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Curated content delivered every Sunday morning
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold mb-2">No Spam</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Only valuable content, never spam or promotions
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="font-semibold mb-2">Unsubscribe Anytime</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Easy one-click unsubscribe if you change your mind
          </p>
        </div>
      </div>
    </div>
  );
}