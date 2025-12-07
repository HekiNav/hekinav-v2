"use server"
import RoutingSideBar from "@/components/routingsidebar";
export default async function Home() {
  return (
    <div className="bg-white p-4">
      <main>
        <div className="flex flex-row pb-2">
          <RoutingSideBar></RoutingSideBar>
          <div className="h-full border-1"></div>
          <div className="shrink p-4"> News or something here [WIP]</div>
        </div>
        
      </main>
    </div>
  );
}
