import Header from '#/components/Header';
import DragDrop from '#/components/DragDrop';
import useProducts from '#/hooks/useProducts';

const HomePage: React.FC = () => {
  const { rows, setRows } = useProducts();

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-5">
      <div className="container mx-auto">
        <Header />
        <DragDrop rows={rows} setRows={setRows} />
      </div>
    </div>
  );
};

export default HomePage;
