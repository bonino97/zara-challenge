// hooks/useProducts.ts
import { useEffect, useState } from 'react';
import useAxios from '#/hooks/useAxios';
import { IProduct } from '#/interfaces/IProduct';

const useProducts = () => {
  const axios = useAxios();
  const [rows, setRows] = useState<IProduct[][]>([]);

  const getProducts = async () => {
    try {
      const { data, error } = await axios.get('/grids');

      if (error) return alert(`Error: ${error}`);

      if (data.length) {
        return setRows(data);
      }

      if (!data.length) {
        const { data, error } = await axios.get('/products');

        if (error) return alert(`Error: ${error}`);

        const newRows: IProduct[][] = [[], [], []];

        for (let i = 0; i < data.length; i++) {
          const rowIndex = i % 3;
          if (newRows[rowIndex].length < 3) {
            newRows[rowIndex].push(data[i]);
          }
        }

        setRows(newRows);
      }
    } catch (error) {
      return alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return { rows, setRows };
};

export default useProducts;
