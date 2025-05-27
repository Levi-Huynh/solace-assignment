export default function Header({ title }: { title: string }) {
  return (
    <header className="w-full bg-gradient-to-r from-greenSecondary to-greenPrimary text-white text-left py-6 px-4">
      {title}
    </header>
  );
}
