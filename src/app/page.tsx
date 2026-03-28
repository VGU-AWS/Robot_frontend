import RegisterLanding from "./RegisterLanding";

export default function Home() {
  return <RegisterLanding endpoint={process.env.ENDPOINT ?? ""} />;
}
