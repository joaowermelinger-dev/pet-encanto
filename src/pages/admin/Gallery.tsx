import { useState, type FormEvent } from 'react'
import { Camera, Plus, Trash2 } from 'lucide-react'
import { useDeletePetPhoto, usePetPhotos, useUpdatePetPhoto, useUploadPetPhoto } from '../../hooks/usePetPhotos'
import type { PetPhoto } from '../../types'
import { ApiError } from '../../api/client'
import Modal from '../../components/Modal'

export default function Gallery() {
  const { data: photos, isLoading } = usePetPhotos()
  const updatePhoto = useUpdatePetPhoto()
  const deletePhoto = useDeletePetPhoto()
  const [showForm, setShowForm] = useState(false)

  async function handleTogglePublic(photo: PetPhoto) {
    await updatePhoto.mutateAsync({
      id: photo.id,
      input: { pet_id: photo.pet_id, caption: photo.caption, is_public: !photo.is_public },
    })
  }

  async function handleDelete(photo: PetPhoto) {
    if (!confirm('Apagar esta foto?')) return
    await deletePhoto.mutateAsync(photo.id)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Galeria</h1>
          <p className="mt-1 text-sm text-muted">
            Fotos exibidas na landing page. Marque "Visível no site" para aparecer publicamente.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)]"
        >
          <Plus size={16} /> Adicionar foto
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl border border-border bg-surface-muted" />
            ))}
          </div>
        ) : !photos || photos.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
            <Camera size={28} className="text-muted" />
            <p className="text-sm text-muted">Nenhuma foto ainda.</p>
            <button onClick={() => setShowForm(true)} className="text-sm font-medium text-accent hover:underline">
              Adicionar a primeira
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {photos.map((photo) => (
              <div key={photo.id} className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
                <div className="relative aspect-square">
                  <img src={photo.image_url} alt={photo.caption ?? 'Foto da galeria'} className="size-full object-cover" />
                  <button
                    onClick={() => handleDelete(photo)}
                    aria-label="Apagar foto"
                    className="absolute right-1.5 top-1.5 rounded-full bg-surface/90 p-1.5 text-muted shadow-soft hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex flex-col gap-1.5 p-2.5">
                  {photo.caption && <p className="truncate text-xs text-muted">{photo.caption}</p>}
                  <label className="flex items-center gap-1.5 text-xs">
                    <input
                      type="checkbox"
                      checked={photo.is_public}
                      onChange={() => handleTogglePublic(photo)}
                      className="accent-accent"
                    />
                    Visível no site
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && <UploadPhotoModal onClose={() => setShowForm(false)} />}
    </div>
  )
}

function UploadPhotoModal({ onClose }: { onClose: () => void }) {
  const uploadPhoto = useUploadPetPhoto()
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!file) {
      setError('Escolha uma foto.')
      return
    }
    try {
      await uploadPhoto.mutateAsync({ file, caption: caption || null, is_public: isPublic })
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao enviar a foto.')
    }
  }

  return (
    <Modal title="Adicionar foto" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-sm">
          Foto (JPEG, PNG ou WEBP, até 5MB)
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm"
          />
        </label>
        <label className="text-sm">
          Legenda (opcional)
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="accent-accent" />
          Visível no site (landing page)
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-muted hover:text-foreground">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={uploadPhoto.isPending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {uploadPhoto.isPending ? 'Enviando…' : 'Enviar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
