import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Pagination } from 'react-bootstrap';
import api from '../../axiosConfig';

const Buy = () => {
  const [purchases, setPurchases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    inventory_name: '',
    seller: {
      name: '',
      address: '',
      phone: '',
      email: '',
      id_card_number: '',
    },
    units: '',
    price: '',
  });

  useEffect(() => {
    fetchPurchases(currentPage);
  }, [currentPage]);

  const fetchPurchases = async (page) => {
    try {
      const response = await api.get(`/purchase?page=${page}&per_page=5`); // Adjust `per_page` as needed
      setPurchases(response.data.items);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('seller.')) {
      const sellerField = name.split('.')[1];
      setFormData({
        ...formData,
        seller: {
          ...formData.seller,
          [sellerField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/purchase', formData);
      fetchPurchases(currentPage);

      // Open a new window with an iframe to display the invoice
      const invoiceWindow = window.open('', '_blank');
      invoiceWindow.document.write(
        `<iframe src="${response.data.invoice_url}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`
      );
    } catch (error) {
      console.error('Error completing purchase:', error);
    }
  };

  return (
    <Container>
      <Card className="p-4 mb-4">
        <Card.Title>Purchase Management</Card.Title>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formInventoryName">
              <Form.Label>Inventory Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter inventory name"
                name="inventory_name"
                value={formData.inventory_name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter price"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formSellerName">
              <Form.Label>Seller Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter seller name"
                name="seller.name"
                value={formData.seller.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formSellerAddress">
              <Form.Label>Seller Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter seller address"
                name="seller.address"
                value={formData.seller.address}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formSellerPhone">
              <Form.Label>Seller Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter seller phone"
                name="seller.phone"
                value={formData.seller.phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formSellerEmail">
              <Form.Label>Seller Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter seller email"
                name="seller.email"
                value={formData.seller.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formSellerIdCard">
              <Form.Label>Seller ID Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter seller ID card number"
                name="seller.id_card_number"
                value={formData.seller.id_card_number}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formUnits">
              <Form.Label>Units</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter number of units"
                name="units"
                value={formData.units}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Complete Purchase
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Purchase History</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Inventory Name</th>
                <th>Units</th>
                <th>Price</th>
                <th>Purchase Date</th>
                <th>Seller Name</th>
                <th>Seller Address</th>
                <th>Seller Phone</th>
                <th>Seller Email</th>
                <th>Seller ID Card Number</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>{purchase.item_name}</td>
                  <td>{purchase.units}</td>
                  <td>{purchase.item_price}</td>
                  <td>{new Date(purchase.purchase_date).toLocaleString()}</td>
                  <td>{purchase.seller_name}</td>
                  <td>{purchase.seller_address}</td>
                  <td>{purchase.seller_phone}</td>
                  <td>{purchase.seller_email}</td>
                  <td>{purchase.seller_id_card_number}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item
                key={page + 1}
                active={page + 1 === currentPage}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Buy;
