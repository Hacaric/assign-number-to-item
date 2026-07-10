import Quiz from "./study/[study_id]/item/[id]/page";

export default function Home() {
  return <div className="flex flox-col items-center justify-center">
    <div>
      <h1 className="mt-20 text-3xl font-bold">Assign number to item</h1><br />
      <p>A study of how we associate everyday items with abstract things such as numbers or colors</p>
      <button className="text-bg font-bold m-5 ml-0 px-3 py-1 border border-1px white cursor-pointer"><a href="/study/1/">Participate</a></button>
    </div>
  </div>;
}
