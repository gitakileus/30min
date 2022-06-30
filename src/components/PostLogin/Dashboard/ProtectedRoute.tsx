import Loader from 'components/shared/Loader/Loader';
import {useRouter} from 'next/router';

type Props = {
  status: string;
  children: React.ReactNode;
};
const ProtectedRoute = ({children, status}: Props) => {
  const router = useRouter();

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'unauthenticated') {
    router.push('/');
    return <Loader />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
