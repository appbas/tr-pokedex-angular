import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../header/header.component";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-templates",
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  templateUrl: "./templates.component.html",
  styleUrls: ["./templates.component.scss"],
})
export class TemplatesComponent {}
