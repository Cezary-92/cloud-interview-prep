const terms = [
  ["Adres IP", "Logiczny adres urzadzenia w sieci, dzieki ktoremu inne urzadzenia wiedza, gdzie wyslac ruch.", "network"],
  ["Publiczny IP", "Adres widoczny w internecie i routowany globalnie.", "network"],
  ["Prywatny IP", "Adres uzywany wewnatrz sieci lokalnej lub chmurowej, bez bezposredniego routingu w internecie.", "network"],
  ["NAT", "Mechanizm tlumaczacy adresy prywatne na publiczne, zeby hosty mogly wychodzic do internetu.", "network"],
  ["DNS", "Usluga tlumaczaca nazwy domenowe, np. example.com, na adresy IP.", "network"],
  ["DHCP", "Automatycznie nadaje hostom konfiguracje sieciowa: IP, brame, DNS i maske.", "network"],
  ["Maska / CIDR", "Okresla, ktora czesc adresu IP jest siecia, a ktora hostem; CIDR zapisuje to np. jako /24.", "network"],
  ["LAN", "Lokalna siec w domu, biurze albo data center.", "network"],
  ["WAN", "Siec rozlegla laczaca lokalizacje, oddzialy lub sieci przez wiekszy obszar.", "network"],
  ["VLAN", "Logiczne wydzielenie sieci na przelaczniku mimo wspolnej fizycznej infrastruktury.", "network"],
  ["Proxy", "Posredniczy w komunikacji klient-serwer, np. dla kontroli, filtrowania lub cache.", "network"],
  ["Reverse proxy", "Stoi przed aplikacjami i przyjmuje ruch klientow, czesto robi TLS, routing i load balancing.", "network"],
  ["Load balancer", "Rozdziela ruch miedzy wiele instancji uslugi, zeby poprawic dostepnosc i wydajnosc.", "network"],
  ["Firewall", "Filtruje ruch wedlug regul, np. portow, adresow IP i protokolow.", "security"],
  ["TLS / HTTPS", "Szyfruje komunikacje i pozwala potwierdzic tozsamosc serwera certyfikatem.", "security"],
  ["MFA", "Dodatkowy skladnik logowania poza haslem, np. aplikacja lub klucz sprzetowy.", "security"],
  ["Least privilege", "Nadawanie tylko minimalnych uprawnien potrzebnych do wykonania pracy.", "security"],
  ["VM", "Wirtualny serwer dzialajacy na fizycznym hoscie przez warstwe wirtualizacji.", "ops"],
  ["Hypervisor", "Warstwa pozwalajaca uruchamiac wiele maszyn wirtualnych na jednym serwerze fizycznym.", "ops"],
  ["Cluster", "Grupa serwerow lub node'ow pracujacych razem jako jedna platforma lub usluga.", "ops"],
  ["HA", "Projektowanie uslugi tak, zeby byla dostepna mimo awarii pojedynczego komponentu.", "ops"],
  ["Redundancja", "Zapasowe komponenty, np. drugi serwer, dysk, lacze lub instancja.", "ops"],
  ["Failover", "Przelaczenie uslugi na zapasowy komponent po awarii glownego.", "ops"],
  ["Backup", "Kopia danych do odtworzenia po awarii, bledzie lub usunieciu.", "ops"],
  ["Snapshot", "Punktowy obraz stanu dysku lub systemu w danym momencie.", "ops"],
  ["RTO", "Czas, w jakim usluga powinna zostac przywrocona po awarii.", "ops"],
  ["RPO", "Maksymalna akceptowalna utrata danych, np. ostatnie 15 minut.", "ops"],
  ["Cloud computing", "Korzystanie z compute, storage i network jako uslug dostepnych na zadanie.", "cloud"],
  ["Region", "Fizyczna lokalizacja dostawcy chmury, w ktorej uruchamiasz zasoby.", "cloud"],
  ["Availability Zone", "Odseparowana lokalizacja w regionie, pomagajaca budowac wysoka dostepnosc.", "cloud"],
  ["Resource Group", "Logiczny kontener na zasoby w Azure, wygodny do uprawnien, kosztow i sprzatania.", "cloud"],
  ["Subscription", "Jednostka rozliczeniowa i administracyjna dla zasobow Azure.", "cloud"],
  ["Tenant", "Instancja Entra ID, czyli katalog uzytkownikow, grup i aplikacji.", "cloud"],
  ["RBAC / IAM", "Zarzadzanie dostepem przez role, grupy, uzytkownikow i uprawnienia.", "cloud"],
  ["Terraform", "Narzedzie do opisywania infrastruktury jako kodu zamiast recznego klikania.", "cloud"],
  ["Terraform state", "Plik, w ktorym Terraform pamieta, jakimi zasobami zarzadza.", "cloud"],
  ["Docker", "Narzedzie do budowania i uruchamiania kontenerow.", "cloud"],
  ["Kubernetes", "Orkiestrator kontenerow: uruchamia, skaluje, restartuje i wystawia aplikacje.", "cloud"]
];

const labs = [
  {
    title: "Cel labu",
    body: "Zbuduj mala, kontrolowana usluge: Linux VM z Nginx, prostymi regulami sieciowymi i podstawowym monitoringiem.",
    code: `az login\naz account show --output table`,
    talk: "Na rozmowie powiedz: zrobilem lab, zeby zrozumiec zaleznosci miedzy compute, network, security i monitoringiem."
  },
  {
    title: "Resource Group i zmienne",
    body: "Resource Group trzyma zasoby labowe razem, dzieki czemu latwo zobaczyc koszty i usunac wszystko po cwiczeniu.",
    code: `RG="rg-cloud-lab"\nLOCATION="westeurope"\nVM_NAME="vm-linux-lab"\nVNET_NAME="vnet-lab"\nSUBNET_NAME="subnet-web"\nNSG_NAME="nsg-web-lab"\nADMIN_USER="azureuser"\n\naz group create --name $RG --location $LOCATION`,
    talk: "To pokazuje porzadek operacyjny: grupujesz zasoby i myslisz o sprzataniu kosztow."
  },
  {
    title: "VNet, subnet i NSG",
    body: "VM w Azure zalezy od sieci. NSG dziala jak chmurowy firewall dla ruchu przychodzacego i wychodzacego.",
    code: `az network vnet create \\\n  --resource-group $RG \\\n  --name $VNET_NAME \\\n  --address-prefix 10.10.0.0/16 \\\n  --subnet-name $SUBNET_NAME \\\n  --subnet-prefix 10.10.1.0/24\n\naz network nsg create --resource-group $RG --name $NSG_NAME\n\naz network nsg rule create \\\n  --resource-group $RG \\\n  --nsg-name $NSG_NAME \\\n  --name Allow-HTTP \\\n  --priority 1000 \\\n  --direction Inbound \\\n  --access Allow \\\n  --protocol Tcp \\\n  --destination-port-ranges 80`,
    talk: "Warto dodac: SSH najlepiej ograniczyc do swojego publicznego IP, a nie otwierac na caly internet."
  },
  {
    title: "Tworzenie VM i instalacja Nginx",
    body: "Uruchamiasz Ubuntu, laczysz sie przez SSH i instalujesz prosta usluge webowa.",
    code: `az vm create \\\n  --resource-group $RG \\\n  --name $VM_NAME \\\n  --image Ubuntu2204 \\\n  --admin-username $ADMIN_USER \\\n  --vnet-name $VNET_NAME \\\n  --subnet $SUBNET_NAME \\\n  --nsg $NSG_NAME \\\n  --public-ip-sku Standard \\\n  --size Standard_B1s \\\n  --generate-ssh-keys\n\nPUBLIC_IP=$(az vm show --resource-group $RG --name $VM_NAME --show-details --query publicIps --output tsv)\nssh azureuser@$PUBLIC_IP\nsudo apt update\nsudo apt install nginx -y\nsudo systemctl status nginx`,
    talk: "Najlepszy wniosek: jesli strona nie dziala, problem moze byc w Azure networking, firewallu systemowym albo w samej usludze."
  },
  {
    title: "Monitoring i prosta diagnoza",
    body: "Sprawdz metryki w Azure Monitor i przecwicz awarie przez zatrzymanie Nginx.",
    code: `sudo systemctl stop nginx\nsudo systemctl status nginx\ncurl localhost\nsudo journalctl -u nginx --since "10 minutes ago"\nsudo systemctl start nginx\n\nVM_ID=$(az vm show --resource-group $RG --name $VM_NAME --query id --output tsv)\naz monitor metrics alert create \\\n  --name "High CPU VM Lab" \\\n  --resource-group $RG \\\n  --scopes $VM_ID \\\n  --condition "avg Percentage CPU > 80" \\\n  --evaluation-frequency 5m \\\n  --window-size 5m \\\n  --severity 3`,
    talk: "To brzmi dobrze: najpierw rozdzielam problem na siec, system, aplikacje i monitoring."
  },
  {
    title: "Sprzatanie zasobow",
    body: "Po labie usun cala Resource Group, zeby nie generowac kosztow.",
    code: `az group delete --name $RG --yes --no-wait`,
    talk: "Na rozmowie to drobiazg, ale pokazuje dojrzalosc: cloud kosztuje, wiec po testach sprzatam zasoby."
  }
];

const categoryNames = {
  network: "Siec",
  ops: "Operacje",
  cloud: "Cloud",
  security: "Security"
};

const termGrid = document.querySelector("#termGrid");
const searchInput = document.querySelector("#searchInput");
const chips = document.querySelectorAll(".chip");
let activeFilter = "all";

function renderTerms() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = terms.filter(([name, desc, category]) => {
    const matchesFilter = activeFilter === "all" || category === activeFilter;
    const matchesQuery = !query || `${name} ${desc} ${categoryNames[category]}`.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });

  termGrid.innerHTML = filtered.map(([name, desc, category]) => `
    <article class="term-card">
      <h3>${name}</h3>
      <p>${desc}</p>
      <span class="tag">${categoryNames[category]}</span>
    </article>
  `).join("");
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    renderTerms();
  });
});

searchInput.addEventListener("input", renderTerms);

const labTitle = document.querySelector("#labTitle");
const labBody = document.querySelector("#labBody");
const labCode = document.querySelector("#labCode");
const labTalk = document.querySelector("#labTalk");
const stepButtons = document.querySelectorAll(".step-button");

function renderLab(index) {
  const lab = labs[index];
  labTitle.textContent = lab.title;
  labBody.textContent = lab.body;
  labCode.textContent = lab.code;
  labTalk.textContent = lab.talk;
  stepButtons.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.step) === index);
  });
}

stepButtons.forEach((button) => {
  button.addEventListener("click", () => renderLab(Number(button.dataset.step)));
});

renderTerms();
renderLab(0);
