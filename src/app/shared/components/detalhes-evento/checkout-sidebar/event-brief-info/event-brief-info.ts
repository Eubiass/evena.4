import { Component, Input } from "@angular/core";

@Component({
  selector: "app-event-brief-info",
  imports: [],
  templateUrl: "./event-brief-info.html",
  styleUrl: "./event-brief-info.css",
})
export class EventBriefInfo {
  @Input() dataExibicao?: string;
  @Input() horario?: string;
}
