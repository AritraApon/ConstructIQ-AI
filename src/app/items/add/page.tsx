import AddItemForm from '@/components/items/AddItemForm';
import { auth } from '@/lib/auth'; // Path to your Better Auth server instance
import { headers } from "next/headers";

const AddItemsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers() // passing the headers object
  });

  const userId: string | undefined = session?.user?.id;

  return (
    <div>

      <AddItemForm userId={userId || ""} />
      
    </div>
  );
};

export default AddItemsPage;