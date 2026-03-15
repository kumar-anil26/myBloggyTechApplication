import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { resetErrorAction } from "../../redux/slices/globalSlices/GlobalSlice";

export default function Errormsg({ message }) {
  const dispatch = useDispatch();
  Swal.fire({ icon: "error", title: "Oops...", text: message });
  dispatch(resetErrorAction());
}
