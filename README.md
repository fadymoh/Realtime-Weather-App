<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/fadymoh/Realtime-Weather-App">
    <img src="images/logo.jpg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Real-Time Weather Application</h3>

</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This section will go through the project overall. The application contains 3 services. Firstly, The polling service, which is responsible for fetching data from OpenWeather and Tomorrow.IO APIs, and aggregating them into InfluxDB. Secondly, User Facing Backend Service, which is responsible for fetching the latest data from InfluxDB, and presenting them to the user without going through the APIs of OpenWeather and Tomorrow.io which decreases the user latency. Also, it forecasts the weather in the next hour and caches it on a configurable interval. This is done because the forecast does not change on a single location quickly. Hence, multiple users can fetch the same forecast for a good interval without any noticable loss of precision. Finally, the User Frontend Service is a simple service that polls the data from the Backend Service on a configurable interval. NGINX has been used to allow loadbalancing between the user request to the User Facing Backend Service which is a cluster to handle heavy load on the service. NGINX has also been configured to handle SSL/TLS offloading by decrypting and encrypting the traffic before going to the User Facing Backend Service.

### Built With

* Node.js
* React.js
* NGINX
* INFLUXDB
* Node-Cache
* OpenWeather API
* Tomorrow.io API

<!-- GETTING STARTED -->
## Getting Started

This section will go through the installation of the 3 services we have in this application.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them. Make sure you have installed InfluxDB, NGINX, and have API Keys for OpenWeather and Tomorrow.io API. This assumes you are on the root directory of the project at the beginning of each code section.

### Installation

1. Get an API key from OpenWeather API
2. Get an API key from Tomorrow.io API
3. Install InfluxDB
4. Install NGINX
5. Clone the repo
6. Install the node packages for each service
    * Polling Service
      ```sh
      cd Polling_Service
      npm install
      ```
    
    * User Facing Backend Service
      ```sh
      cd User_Facing_Backend_Service
      npm install
      ```
    
    * User Frontend Service
      ```sh
      cd User_Frontend_Service
      npm install
      ```
7. Run InfluxDB from the CMD at the installation folder
      ```sh
      influxd.exe
      ```
8. Obtain InfluxDB API key
9. Create a bucket on InfluxDB which is where the data will be saved
10. Go through the .env files in each service and update them with the keys and data you obtained in the previous steps

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [ ] Add Authentication and authorization
- [ ] Add rate limiting through NGINX
- [ ] Create a better responsive front end
- [ ] Create a docker image for the application 
- [ ] Support Multiple Geographic Locations

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the APACHE 2.0 License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

* **Fady Mohamed** [fadymoh](https://www.linkedin.com/in/fady-mohamed-865384136/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
