import Admin from "../../components/Admin";
import "./admin.css";
export const metadata = {
  title: "Редактор сайта",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <Admin />;
}
