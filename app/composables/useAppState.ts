export const useAppState = () => {
  const role = useState<'admin' | 'viewer'>('user-role', () => 'admin')
  const currentView = useState('cur-view', () => 'dashboard')
  
  const toggleRole = () => {
    role.value = role.value === 'admin' ? 'viewer' : 'admin'
  }

  return {
    role,
    currentView,
    toggleRole
  }
}