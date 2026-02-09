import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { Card, Button } from '../components/common';

const NotFoundPage = () => {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center">
          <div className="py-8">
            <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Page non trouvée
            </h1>
            <p className="text-gray-600 mb-6">
              La page que vous recherchez n&apos;existe pas ou a été déplacée.
            </p>
            <Link to="/">
              <Button variant="primary">
                Retour au tableau de bord
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;
