type Props = {
  children: React.ReactNode;
};

export default function AdminPageContainer({ children }: Props) {
  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </div>
  );
}
