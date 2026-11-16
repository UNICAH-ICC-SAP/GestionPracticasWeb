import Swal from 'sweetalert2';
import { Post } from './Utilities';

export async function showInvitation(invitationToken: string) {
    const url = new URL(import.meta.env.BASE_URL, window.location.origin);
    url.hash = new URLSearchParams({ invitation: invitationToken }).toString();
    await Swal.fire({
        title: 'Cuenta creada',
        text: 'Comparte este enlace de activación con el titular. Vence en 24 horas y solo puede utilizarse una vez.',
        input: 'text',
        inputValue: url.toString(),
        inputAttributes: { readonly: 'readonly' },
        confirmButtonText: 'Continuar',
    });
}

export async function renewInvitation(userId: string) {
    const confirmation = await Swal.fire({
        title: 'Renovar acceso',
        text: 'La contraseña, las sesiones y los enlaces anteriores dejarán de funcionar. Comparte el nuevo enlace con el titular.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Generar enlace',
        cancelButtonText: 'Cancelar',
    });
    if (!confirmation.isConfirmed) return;
    const response = await Post({ url: '/user/invitation', data: { userId } });
    if (response.error.code) {
        await Swal.fire({ icon: 'error', title: 'No se pudo renovar el acceso', text: response.error.message });
        return;
    }
    const result = response.singleData as { invitationToken: string };
    await showInvitation(result.invitationToken);
}
