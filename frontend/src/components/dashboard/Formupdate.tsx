import { Component, createSignal, For } from "solid-js";

const Formupdate: Component = () => {
  const [firstName, setFirstName] = createSignal<string>("");
  const [lastName, setLastName] = createSignal<string>("");
  const [email, setEmail] = createSignal<string>("");
  const [phone, setPhone] = createSignal<string>("");
  const [error, setError] = createSignal<string>("");
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    const userExists = users.some(
      (user: any) => user.email === email() || user.phone === phone()
    );
    if (userExists) {
      setError("User with this email or phone number already exists");
      return;
    }
    const newUser = {
      firstName: firstName(),
      lastName: lastName(),
      email: email(),
      phone: phone(),
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    window.location.reload();
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <label>
          First Name
          <input
            type="text"
            value={firstName()}
            onInput={(e) => setFirstName((e.target as HTMLInputElement).value)}
            required
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName()}
            onInput={(e) => setLastName((e.target as HTMLInputElement).value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email()}
            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            required
          />
        </label>
        <label>
          Phone Number
          <input
            type="tel"
            value={phone()}
            onInput={(e) => setPhone((e.target as HTMLInputElement).value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
        {error() && <div>{error()}</div>}
      </form>
      <div class="flex flex-wrap justify-between items-center mb-4 max-w-full gap-4">
        <For each={users}>
          {(user: any) => (
            <div class="bg-white text-slate-950 p-6 rounded-lg border border-black shadow flex flex-row flex-wrap">
              <div class="text-2xl justify-between items-center mb-4 border mx-4 border-l-purple-400 rounded">
                <span class="font-semibold pr-6">
                  {user.firstName} {user.lastName}
                </span>
                <span class="material-icons">⭐</span>
              </div>
              <div class="text-2xl font-bold px-6 border border-l-purple-400 rounded items-center">
                {user.email}
              </div>
              <div class="text-2xl font-bold border mx-4 border-l-purple-400 rounded items-center">
                {user.phone}
              </div>
            </div>
          )}
        </For>
      </div>
    </>
  );
};

export default Formupdate;
