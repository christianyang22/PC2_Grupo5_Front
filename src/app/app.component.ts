import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './servicios/auth-service.service';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] 
})
export class AppComponent implements OnInit {
  title = 'PCII_GRUPO5';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe(user => {
      if (user && user.rol) {
        this.authService.setRole(user.rol);
      }
    });
  }
}
