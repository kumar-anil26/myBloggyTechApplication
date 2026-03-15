import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { resetSuccessAction } from "../../redux/slices/globalSlices/GlobalSlice";

export default function Successmsg({ message }) {
  const dispatch = useDispatch();
  Swal.fire({ icon: "success", title: "Good Job...", text: message });
  dispatch(resetSuccessAction());
}
