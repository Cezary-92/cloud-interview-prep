const terms = [
  ["Adres IP", "Logiczny adres urządzenia w sieci, dzięki któremu inne urządzenia wiedzą, gdzie wysłać ruch.", "network"],
  ["Publiczny IP", "Adres widoczny w internecie i routowany globalnie.", "network"],
  ["Prywatny IP", "Adres używany wewnątrz sieci lokalnej lub chmurowej, bez bezpośredniego routingu w internecie.", "network"],
  ["NAT", "Mechanizm tłumaczący adresy prywatne na publiczne, żeby hosty mogły wychodzić do internetu.", "network"],
  ["DNS", "Usługa tłumacząca nazwy domenowe, np. example.com, na adresy IP.", "network"],
  ["DHCP", "Automatycznie nadaje hostom konfigurację sieciową: IP, bramę, DNS i maskę.", "network"],
  ["Maska / CIDR", "Określa, która część adresu IP jest siecią, a która hostem; CIDR zapisuje to np. jako /24.", "network"],
  ["LAN", "Lokalna sieć w domu, biurze albo data center.", "network"],
  ["WAN", "Sieć rozległa łącząca lokalizacje, oddziały lub sieci przez większy obszar.", "network"],
  ["VLAN", "Logiczne wydzielenie sieci na przełączniku mimo wspólnej fizycznej infrastruktury.", "network"],
  ["Proxy", "Pośredniczy w komunikacji klient-serwer, np. dla kontroli, filtrowania lub cache.", "network"],
  ["Reverse proxy", "Stoi przed aplikacjami i przyjmuje ruch klientów, często robi TLS, routing i load balancing.", "network"],
  ["Load balancer", "Rozdziela ruch między wiele instancji usługi, żeby poprawić dostępność i wydajność.", "network"],
  ["Firewall", "Filtruje ruch według reguł, np. portów, adresów IP i protokołów.", "security"],
  ["TLS / HTTPS", "Szyfruje komunikację i pozwala potwierdzić tożsamość serwera certyfikatem.", "security"],
  ["MFA", "Dodatkowy składnik logowania poza hasłem, np. aplikacja lub klucz sprzętowy.", "security"],
  ["Least privilege", "Nadawanie tylko minimalnych uprawnień potrzebnych do wykonania pracy.", "security"],
  ["VM", "Wirtualny serwer działający na fizycznym hoście przez warstwę wirtualizacji.", "ops"],
  ["Hypervisor", "Warstwa pozwalająca uruchamiać wiele maszyn wirtualnych na jednym serwerze fizycznym.", "ops"],
  ["Cluster", "Grupa serwerów lub node'ów pracujących razem jako jedna platforma lub usługa.", "ops"],
  ["HA", "Projektowanie usługi tak, żeby była dostępna mimo awarii pojedynczego komponentu.", "ops"],
  ["Redundancja", "Zapasowe komponenty, np. drugi serwer, dysk, łącze lub instancja.", "ops"],
  ["Failover", "Przełączenie usługi na zapasowy komponent po awarii głównego.", "ops"],
  ["Backup", "Kopia danych do odtworzenia po awarii, błędzie lub usunięciu.", "ops"],
  ["Snapshot", "Punktowy obraz stanu dysku lub systemu w danym momencie.", "ops"],
  ["RTO", "Czas, w jakim usługa powinna zostać przywrócona po awarii.", "ops"],
  ["RPO", "Maksymalna akceptowalna utrata danych, np. ostatnie 15 minut.", "ops"],
  ["systemctl", "Podstawowe narzędzie do sprawdzania, startowania i restartowania usług w Linuxie.", "linux"],
  ["journalctl", "Czyta logi systemd, szczególnie przydatne do diagnozy usług.", "linux"],
  ["df -h", "Pokazuje zajętość filesystemów w czytelnej formie.", "linux"],
  ["du -sh", "Pokazuje rozmiar katalogu lub pliku, przydatne przy zapełnionym dysku.", "linux"],
  ["ps aux", "Pokazuje procesy działające w systemie.", "linux"],
  ["ss -tulpn", "Pokazuje porty nasłuchujące oraz procesy, które ich używają.", "linux"],
  ["chmod", "Zmienia uprawnienia pliku lub katalogu.", "linux"],
  ["chown", "Zmienia właściciela i grupę pliku lub katalogu.", "linux"],
  ["adduser", "Tworzy nowego użytkownika w systemie.", "linux"],
  ["Cloud computing", "Korzystanie z compute, storage i network jako usług dostępnych na żądanie.", "cloud"],
  ["Region", "Fizyczna lokalizacja dostawcy chmury, w której uruchamiasz zasoby.", "cloud"],
  ["Availability Zone", "Odseparowana lokalizacja w regionie, pomagająca budować wysoką dostępność.", "cloud"],
  ["Resource Group", "Logiczny kontener na zasoby w Azure, wygodny do uprawnień, kosztów i sprzątania.", "cloud"],
  ["Subscription", "Jednostka rozliczeniowa i administracyjna dla zasobow Azure.", "cloud"],
  ["Tenant", "Instancja Entra ID, czyli katalog użytkowników, grup i aplikacji.", "cloud"],
  ["RBAC / IAM", "Zarządzanie dostępem przez role, grupy, użytkowników i uprawnienia.", "cloud"],
  ["Terraform", "Narzędzie do opisywania infrastruktury jako kodu zamiast ręcznego klikania.", "cloud"],
  ["Terraform state", "Plik, w którym Terraform pamięta, jakimi zasobami zarządza.", "cloud"],
  ["Docker", "Narzędzie do budowania i uruchamiania kontenerów.", "cloud"],
  ["Kubernetes", "Orkiestrator kontenerów: uruchamia, skaluje, restartuje i wystawia aplikacje.", "cloud"]
];

const labs = [
  {
    title: "Cel labu",
    body: "Zbuduj małą, kontrolowaną usługę: Linux VM z Nginx, prostymi regułami sieciowymi i podstawowym monitoringiem.",
    code: `az login\naz account show --output table`,
    talk: "Na rozmowie powiedz: zrobiłem lab, żeby zrozumieć zależności między compute, network, security i monitoringiem."
  },
  {
    title: "Resource Group i zmienne",
    body: "Resource Group trzyma zasoby labowe razem, dzięki czemu łatwo zobaczyć koszty i usunąć wszystko po ćwiczeniu.",
    code: `RG="rg-cloud-lab"\nLOCATION="westeurope"\nVM_NAME="vm-linux-lab"\nVNET_NAME="vnet-lab"\nSUBNET_NAME="subnet-web"\nNSG_NAME="nsg-web-lab"\nADMIN_USER="azureuser"\n\naz group create --name $RG --location $LOCATION`,
    talk: "To pokazuje porządek operacyjny: grupujesz zasoby i myślisz o sprzątaniu kosztów."
  },
  {
    title: "VNet, subnet i NSG",
    body: "VM w Azure zależy od sieci. NSG działa jak chmurowy firewall dla ruchu przychodzącego i wychodzącego.",
    code: `az network vnet create \\\n  --resource-group $RG \\\n  --name $VNET_NAME \\\n  --address-prefix 10.10.0.0/16 \\\n  --subnet-name $SUBNET_NAME \\\n  --subnet-prefix 10.10.1.0/24\n\naz network nsg create --resource-group $RG --name $NSG_NAME\n\naz network nsg rule create \\\n  --resource-group $RG \\\n  --nsg-name $NSG_NAME \\\n  --name Allow-HTTP \\\n  --priority 1000 \\\n  --direction Inbound \\\n  --access Allow \\\n  --protocol Tcp \\\n  --destination-port-ranges 80`,
    talk: "Warto dodać: SSH najlepiej ograniczyć do swojego publicznego IP, a nie otwierać na cały internet."
  },
  {
    title: "Tworzenie VM i instalacja Nginx",
    body: "Uruchamiasz Ubuntu, łączysz się przez SSH i instalujesz prostą usługę webową.",
    code: `az vm create \\\n  --resource-group $RG \\\n  --name $VM_NAME \\\n  --image Ubuntu2204 \\\n  --admin-username $ADMIN_USER \\\n  --vnet-name $VNET_NAME \\\n  --subnet $SUBNET_NAME \\\n  --nsg $NSG_NAME \\\n  --public-ip-sku Standard \\\n  --size Standard_B1s \\\n  --generate-ssh-keys\n\nPUBLIC_IP=$(az vm show --resource-group $RG --name $VM_NAME --show-details --query publicIps --output tsv)\nssh azureuser@$PUBLIC_IP\nsudo apt update\nsudo apt install nginx -y\nsudo systemctl status nginx`,
    talk: "Najlepszy wniosek: jeśli strona nie działa, problem może być w Azure networking, firewallu systemowym albo w samej usłudze."
  },
  {
    title: "Monitoring i prosta diagnoza",
    body: "Sprawdź metryki w Azure Monitor i przećwicz awarię przez zatrzymanie Nginx.",
    code: `sudo systemctl stop nginx\nsudo systemctl status nginx\ncurl localhost\nsudo journalctl -u nginx --since "10 minutes ago"\nsudo systemctl start nginx\n\nVM_ID=$(az vm show --resource-group $RG --name $VM_NAME --query id --output tsv)\naz monitor metrics alert create \\\n  --name "High CPU VM Lab" \\\n  --resource-group $RG \\\n  --scopes $VM_ID \\\n  --condition "avg Percentage CPU > 80" \\\n  --evaluation-frequency 5m \\\n  --window-size 5m \\\n  --severity 3`,
    talk: "To brzmi dobrze: najpierw rozdzielam problem na sieć, system, aplikację i monitoring."
  },
  {
    title: "Sprzątanie zasobów",
    body: "Po labie usuń całą Resource Group, żeby nie generować kosztów.",
    code: `az group delete --name $RG --yes --no-wait`,
    talk: "Na rozmowie to drobiazg, ale pokazuje dojrzałość: cloud kosztuje, więc po testach sprzątam zasoby."
  }
];

const categoryNames = {
  network: "Sieć",
  ops: "Operacje",
  linux: "Linux",
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
