import {Component} from "@angular/core";
import {ToastMessage} from "../../../core/models/toastMessage.interface";
import {NgClass} from "@angular/common";

@Component({
  selector: "app-toaster",
  standalone: true,
  imports: [NgClass],
  templateUrl: "./toaster.component.html",
  styleUrl: "./toaster.component.scss",
})
export class ToasterComponent {
  messages: ToastMessage[] = [];

  addMessage(text: string, type: "success" | "error" | "info" | "warning" = "info") {
    const message: ToastMessage = {text, type};
    this.messages.push(message);

    setTimeout(() => this.removeMessage(message), 3000);
  }

  removeMessage(message: ToastMessage) {
    this.messages = this.messages.filter((m) => m !== message);
  }
}
