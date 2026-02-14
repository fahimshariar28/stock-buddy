import { SignIn } from "@stackframe/stack";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-purple-50 to-purple-100">
      <div className="max-w-md w-full space-y-8">
        <SignIn />
        <Link href="/">GO BACK TO HOME</Link>
      </div>
    </div>
  );
}
