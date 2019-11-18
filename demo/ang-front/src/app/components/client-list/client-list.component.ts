/**
 * Pääkomponentti, joka näytetään sivulla.
 * Sisältää funktioita asiakkaiden hakemiseen, lisäämiseen
 * ja viestien lähettämiseen.
 */
import { Component, OnInit, NgZone } from '@angular/core';
import { QueryService } from 'src/app/services/query.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

  // Taulukko asiakkaille
  private clients: [];

  constructor(private qs: QueryService, private ngZone: NgZone) { }

  ngOnInit() {
    // Haetaan asiakkaat.
    this.updateClients();
  }

  /**
   * Funktio, joka kutsuu QueryServicessä olevaa mutaatiota
   * asiakkaan lisäämiseksi.
   * @param formData NgFormin sisältämä data
   */
  clientFormSubmit(formData) {
    this.qs.addClient(formData.nimi, parseInt(formData.ika, 10)).subscribe(() => {
      this.updateClients();
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * Funktio, joka kutsuu QueryServicessä olevaa mutaatiota
   * viestin lähettämiseksi.
   * @param formData NgFormin sisältämä data
   */
  messageFormSubmit(formData) {
    this.qs.sendMessage(formData.from, formData.to, formData.msg).subscribe(() => {
      this.updateClients();
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * Funktio, jonka avulla haetaan käyttäjät tietokannasta.
   * QueryServicen funktio getClients() palauttaa QueryRef-objektin,
   * jolla on Observable-ominaisuus nimeltä valueChanges.
   * Tämä observable tilataan ja sen tuloksista saadaan data-objekti,
   * joka sisältää henkilot-taulukon täynnä Henkilo-objekteja.
   */
  updateClients() {
    this.qs.getClients().valueChanges.subscribe((result) => {
      // result sisältää loading-booleanin, joka on false kun query on suoritettu
      if (!result.loading) {
        this.clients = result.data.henkilot;
      }
    });
  }

}
