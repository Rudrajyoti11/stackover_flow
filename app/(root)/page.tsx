import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const Home = async () => {
  await auth();

  return (
    <>
      <h1 className="h1-bold">Welcome to the world of Next.js</h1>

      <form
        className="px-10 pt-25"
        action={async () => {
          "use server";

          try {
            await signOut({ redirectTo: ROUTES.SIGN_IN });
          } catch (error) {
            console.error("Sign out error:", error);
            throw error;
          }
        }}
      >
        <Button type="submit">Log out</Button>
      </form>
    </>
  );
};

export default Home;
