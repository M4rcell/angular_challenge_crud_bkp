import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  showContextMenu = false;

  toggleContextMenu() {
    this.showContextMenu = !this.showContextMenu;
  }

  editar() {
    // Acción de editar
  }

  eliminar() {
    // Acción de eliminar
  }
}
