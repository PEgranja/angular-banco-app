import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  data = [
    { col1: 'Dato 1', col2: 'Dato 2', col3: 'Dato 3' },
    { col1: 'Dato 4', col2: 'Dato 5', col3: 'Dato 6' },
    { col1: 'Dato 1', col2: 'Dato 2', col3: 'Dato 3' },
    { col1: 'Dato 4', col2: 'Dato 5', col3: 'Dato 6' },
    { col1: 'Dato 1', col2: 'Dato 2', col3: 'Dato 3' },
    { col1: 'Dato 4', col2: 'Dato 5', col3: 'Dato 6' },
    { col1: 'Dato 1', col2: 'Dato 2', col3: 'Dato 3' },
    { col1: 'Dato 4', col2: 'Dato 5', col3: 'Dato 6' },
    { col1: 'Dato 1', col2: 'Dato 2', col3: 'Dato 3' },
    { col1: 'Dato 4', col2: 'Dato 5', col3: 'Dato 6' },
    { col1: 'Dato 1', col2: 'Dato 2', col3: 'Dato 3' },
    { col1: 'Dato 4', col2: 'Dato 5', col3: 'Dato 6' },
    { col1: 'Dato 1', col2: 'Dato 2', col3: 'Dato 3' },
    { col1: 'Dato 4', col2: 'Dato 500', col3: 'Dato 6' },
    // Agrega más datos aquí
  ];

  filteredData = [...this.data];
  paginatedData: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: any[] = [];

  ngOnInit() {
    this.updatePagination();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredData = this.data.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(filterValue)
      )
    );
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
    this.totalPages = Array(
      Math.ceil(this.filteredData.length / this.itemsPerPage)
    )
      .fill(0)
      .map((x, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }
}
