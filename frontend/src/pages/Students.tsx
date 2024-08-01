import { ParentComponent } from "solid-js";
import Sidebar from "../components/dash/Sidebar";

const Students: ParentComponent = (props) => {
  return (
    <main class="flex flex-row justify-end m-auto">
      <Sidebar />
      {props.children}
    </main>
  )
}

export default Students;
