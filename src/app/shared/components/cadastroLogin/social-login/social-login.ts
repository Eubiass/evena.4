import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-social-login",
  imports: [],
  templateUrl: "./social-login.html",
  styleUrl: "./social-login.css",
})
export class SocialLogin {
  @Output() googleClick = new EventEmitter<void>();
  @Output() appleClick = new EventEmitter<void>();

  entrarComGoogle() {
    this.googleClick.emit();
  }

  entrarComApple() {
    this.appleClick.emit();
  }
}
