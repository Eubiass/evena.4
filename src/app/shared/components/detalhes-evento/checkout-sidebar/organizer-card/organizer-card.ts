import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-organizer-card",
  imports: [],
  templateUrl: "./organizer-card.html",
  styleUrl: "./organizer-card.css",
})
export class OrganizerCard {
  @Input() organizador: any;
  @Input() isSeguindo: boolean = false;

  @Output() profileClick = new EventEmitter<void>();
  @Output() followToggle = new EventEmitter<Event>();

  onProfileClick(): void {
    this.profileClick.emit();
  }

  onFollowClick(event: Event): void {
    event.stopPropagation();
    this.followToggle.emit(event);
  }
}
