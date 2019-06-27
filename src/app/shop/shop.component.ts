import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';

import { AppService } from '../directive/app.service';
import { Action } from '../directive/app.constants';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  itemData = [
    { itemName: 'Ignacio Chairs', price: '39.00', description: 'Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.' },
    { itemName: 'Diamond Lamp', price: '23.00', description: 'Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.' },
    { itemName: 'High Table', price: '15.00', description: 'Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.' },
    { itemName: 'Pendant Shade', price: '20.00', description: 'Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.' },
    { itemName: 'Aslesha Basket', price: '27.00', description: 'Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.' },
    { itemName: 'Driva Table Lamp', price: '56.00', description: 'Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.' },
    { itemName: 'Hanging Sphere', price: '18.00', description: 'Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.' },
    { itemName: 'Portable Speaker', price: '42.00', description: 'Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.' }
  ]
  productData: Array<any> = [];
  showGrid: Boolean = false;
  show_product: any = 10;
  page: any = 1;
  totalRecord: Number = 0;
  sellerData: Array<any> = [
    { 'name': 'Crackle Plates', 'price': 22.99 },
    { 'name': 'floor lamp', 'price': 48.05 },
    { 'name': 'wooden fan', 'price': 25.54 }
  ];

  categoriesData: Array<any> = [];
  sizeData: Array<any> = [
    { 'name': 'xs', 'quantity': 35 },
    { 'name': 's', 'quantity': 15 },
    { 'name': 'm', 'quantity': 12 },
    { 'name': 'l', 'quantity': 15 },
    { 'name': 'xl', 'quantity': 15 },
    { 'name': 'xxl', 'quantity': 15 }
  ];
  colorData: Array<any> = [
    { 'color': 'black', 'quantity': 4 },
    { 'color': 'green', 'quantity': 15 },
    { 'color': 'pink', 'quantity': 12 },
    { 'color': 'blue', 'quantity': 6 },
    { 'color': 'red', 'quantity': 8 },
    { 'color': 'yellow', 'quantity': 2 }
  ];
  minValue: number = 22;
  maxValue: number = 77;
  options: Options = {
    floor: 0,
    ceil: 100,
    step: 1

  };
  categoryID: any = '';
  constructor(private appService: AppService, private cookieService: CookieService, public router: Router) {
    this.categoryID = localStorage.getItem('category_id') != null ? localStorage.getItem('category_id') : '';
    this.getProductList();
    this.getCategory();
  }


  ngOnInit() {

  }
  getCategory() {
    let action = Action.CATEGORY;
    this.appService.getMethod(action)
      .subscribe(data => {
        console.log(data);
        this.categoriesData = data;
      }, error => {
      });
  }
  getProductList() {
    let action = Action.PRODUCTS;

    let filter = '&category=' + this.categoryID;

    this.appService.getMethod(action + '?lang=en&start=0&count=12' + filter)
      .subscribe(data => {
        // console.log(data);
        this.totalRecord = data.totalCount;
        this.productData = data.products;
      }, error => {
      });
  }
  onHideShowGrid() {
    this.showGrid = !this.showGrid;
  }
  onFilter(result, status) {
    if (status == 0) {
      this.categoryID = result.id;
    }
    this.getProductList()
  }
  addToCart(result) {
    let action = Action.CART;
    let param = { "product": result.id, "quantity": 1 }
    if (this.cookieService.get('shopizer-cart-id')) {
      let id = this.cookieService.get('shopizer-cart-id');
      this.appService.putMethod(action, id, param)
        .subscribe(data => {

        }, error => {
        });
    } else {
      this.appService.postMethod(action, param)
        .subscribe(data => {
          console.log(data);
          this.cookieService.set('shopizer-cart-id', data.code)
        }, error => {
        });
    }
  }
  goToDetailsPage(result) {
    this.router.navigate(['/product-detail'], { queryParams: { productId: result.id } });
    // this.router.navigate(['/product-detail'], { param: { productid: result.id } });
  }
}
