import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <h1 className="mt-20 text-3xl font-bold">Assign number to item</h1>
        <br />
        <p>A study of how we associate everyday items with abstract things such as numbers or colors</p>
        <Link 
            href="/study/1/" 
            className="text-bg font-bold m-5 ml-0 px-3 py-1 border border-white cursor-pointer inline-block"
        >
          Participate
        </Link>
      </div>
    </div>
  );
}