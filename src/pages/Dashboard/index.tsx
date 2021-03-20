import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface EditingFood {
  id: number;
}

interface FoodInterface {
  id: number
  available: boolean
  image: string
  name: string
  description: string
  price: string
}

const Dashboard = () => {
  const [foods, setFoods] = useState<FoodInterface[]>([])
  const [editingFood, setEditingFood] = useState<EditingFood>({} as EditingFood)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  async function handleAddFood (food: Omit<FoodInterface, 'id'>) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood (food: FoodInterface) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood (id: number) {
    try {
      await api.delete(`/foods/${id}`);

      const foodsFiltered = foods.filter(food => food.id !== id);

      setFoods(foodsFiltered)
    } catch (err) {
      console.log(err);
    }
  }

  function toggleModal () {
    setModalOpen(prev => !prev)
  }

  function toggleEditModal () {
    setEditModalOpen(prev => !prev)
  }

  function handleEditFood (food: FoodInterface) {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  useEffect(() => {
    api.get('/foods').then(response => setFoods(response.data))
  }, [])

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={() => handleDeleteFood(food.id)}
              handleEditFood={() => handleEditFood(food)}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
