import { For } from "solid-js";

const AlumniSection = () => {
  const alumni = [
    {
      name: "Mary Entrepreneur",
      year: "Class of 2018",
      bio: "Mary is now a successful entrepreneur, having founded a tech startup that has revolutionized the industry.",
      photo: "https://via.placeholder.com/150x150?text=John+Doe",
    },
    {
      name: "Jane Scientist",
      year: "Class of 2019",
      bio: "Jane is a renowned scientist, contributing to groundbreaking research in environmental sustainability.",
      photo: "https://via.placeholder.com/150x150?text=Jane+Smith",
    },
    {
      name: "Juliet Author",
      year: "Class of 2020",
      bio: "Juliet is an award-winning author, inspiring readers with his impactful stories.",
      photo: "https://via.placeholder.com/150x150?text=Michael+Brown",
    },
    // Add more alumni here
  ];

  return (
    <section class="bg-inherit mx-auto py-12">
      <div class="mx-auto">
        <h2 class="text-3xl font-bold text-center my-4">Alumni</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-inherit">
          <For each={alumni}>
            {(alum) => (
              <div class="p-6 rounded-lg shadow-lg text-center">
                <img
                  src={alum.photo}
                  alt={alum.name}
                  class="rounded-full h-32 w-32 mx-auto mb-4"
                />
                <h3 class="text-xl font-semibold mb-2">{alum.name}</h3>
                <p class="mb-4">{alum.year}</p>
                <p>{alum.bio}</p>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  );
};

export default AlumniSection;
