import Image from "next/image";

export default function HomePage() {
  return (
    <main>
      <div>
        <a href="https://nextjs.org/docs">
          <Image width={100} height={100} src="/nextjs.png" alt="Nextjs logo" />
        </a>
        <p>Hello nextjs</p>
      </div>
    </main>
  );
}
