import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TemplatesComponent } from "./core/templates/templates.component";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./core/templates/templates.routes").then((r) => r.routes),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
