"use server"
import RoutingSideBar from "@/components/routingsidebar";
export default async function Home() {
  return (
    <div className="bg-white p-4">
      <main>
        <div className="flex flex-row pb-2">
          <RoutingSideBar></RoutingSideBar>
          <div className="h-full border-1"></div>
          <div className="shrink p-4"> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum, accusamus omnis, sed delectus sit quaerat pariatur tenetur debitis, reprehenderit ea et earum quae magnam odio impedit. Magnam facilis laudantium excepturi.</div>
        </div>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Autem saepe et sit nemo nihil doloremque quibusdam quo, voluptatem tempora culpa minus. Officia dolore suscipit expedita similique molestiae quasi sit eum.
      </main>
    </div>
  );
}
