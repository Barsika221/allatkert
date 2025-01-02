interface Animal {
    id: number;
    name: string;
    species: string;
    age: number;
  }
  
  interface AnimalsBySpecies {
    species: string;
    _count: number;
  }
  
  const API_URL = 'http://localhost:3000';
  
  async function fetchAnimals(): Promise<Animal[]> {
    const response = await fetch(`${API_URL}/animals`);
    return response.json();
  }
  
  async function fetchAnimalsBySpecies(): Promise<AnimalsBySpecies[]> {
    const response = await fetch(`${API_URL}/animals/bySpecies`);
    return response.json();
  }  
  
  async function addAnimal(animal: Omit<Animal, 'id'>): Promise<Animal> {
    const response = await fetch(`${API_URL}/animals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(animal),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  }
  
  async function deleteAnimal(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/animals/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
  }
  
  function renderAnimals(animals: Animal[]) {
    const tableBody = document.querySelector('#animalsTable tbody');
    const template = document.getElementById('animalRowTemplate') as HTMLTemplateElement;
  
    if (tableBody && template) {
      tableBody.innerHTML = '';
      animals.forEach(animal => {
        const clone = template.content.cloneNode(true) as DocumentFragment;
        const cells = clone.querySelectorAll('td');
        cells[0].textContent = animal.id.toString();
        cells[1].textContent = animal.name;
        cells[2].textContent = animal.species;
        cells[3].textContent = animal.age.toString();
  
        const deleteButton = (document.getElementById('deleteButtonTemplate') as HTMLTemplateElement).content.cloneNode(true) as DocumentFragment;
        deleteButton.querySelector('.deleteButton')?.addEventListener('click', () => handleDelete(animal.id));
        clone.querySelector('tr')?.appendChild(deleteButton);
  
        tableBody.appendChild(clone);
      });
    }
  }
  
  function renderAnimalsBySpecies(animalsBySpecies: AnimalsBySpecies[]) {
    const tableBody = document.querySelector('#animalsBySpeciesTable tbody');
    const template = document.getElementById('animalsBySpeciesRowTemplate') as HTMLTemplateElement;
  
    if (tableBody && template) {
      tableBody.innerHTML = '';
      animalsBySpecies.forEach(item => {
        const clone = template.content.cloneNode(true) as DocumentFragment;
        const cells = clone.querySelectorAll('td');
        cells[0].textContent = item.species;
        cells[1].textContent = item._count.toString();
        tableBody.appendChild(clone);
      });
    }
  }
  
  
  async function handleDelete(id: number) {
    try {
      await deleteAnimal(id);
      init();
    } catch (error) {
      console.error('Hiba történt a törlés során:', error);
      showError('Hiba történt a törlés során. Kérjük, próbálja újra.');
    }
  }
  
  function showError(message: string) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }
  
  function setupForm() {
    const form = document.getElementById('addAnimalForm') as HTMLFormElement;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const newAnimal = {
        name: formData.get('name') as string,
        species: formData.get('species') as string,
        age: parseInt(formData.get('age') as string, 10),
      };
  
      try {
        await addAnimal(newAnimal);
        form.reset();
        init();
      } catch (error) {
        console.error('Hiba történt az állat hozzáadása során:', error);
        showError('Hiba történt az állat hozzáadása során. Kérjük, próbálja újra.');
      }
    });
  }
  
  async function init() {
    try {
      const animals = await fetchAnimals();
      renderAnimals(animals);
  
      const animalsBySpecies = await fetchAnimalsBySpecies();
      renderAnimalsBySpecies(animalsBySpecies);
  
      setupForm();
    } catch (error) {
      console.error('Hiba történt az adatok lekérdezése során:', error);
      showError('Hiba történt az adatok lekérdezése során. Kérjük, frissítse az oldalt.');
    }
  }
  
  init();
  