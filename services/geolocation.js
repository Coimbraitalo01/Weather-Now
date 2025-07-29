export async function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => {
          let errorMessage = "Erro na geolocalização";
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permissão negada pelo usuário";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Localização indisponível";
              break;
            case error.TIMEOUT:
              errorMessage = "Tempo de espera esgotado";
              break;
          }
          reject(new Error(errorMessage));
        },
        { timeout: 10000 }
      );
    } else {
      reject(new Error("Geolocalização não suportada"));
    }
  });
}