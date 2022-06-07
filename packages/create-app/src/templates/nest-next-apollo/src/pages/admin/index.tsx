import useAuth from '@/hooks/useAuth';

export default function AdminIndexPage() {
  const { user } = useAuth();

  console.log(user);

  return (
    <div>AdminIndexPage</div>
  );
}
