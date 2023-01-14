"use client";
import { Modal, Button, Label, TextInput, Checkbox } from "flowbite-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useMutation } from "react-query";
type FormData = {
  name?: string;
  email?: string;
  telegramToken?: string;
  agree?: boolean;
};

const createTeam = async (formData: FormData) => {
  const data = await (
    await axios.post("/api/createEnterprize", { ...formData })
  ).data;
  return data;
};

const CreateTeamModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const session = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({});

  const {
    data,
    isLoading: isCreating,
    mutate: sendCreate,
  } = useMutation(() => createTeam(formData), {
    onSuccess: (data) => {
      if (data?.code === "INVALID_TOKEN") {
        alert("Invalid Bot Token. Please enter the correct token.");
        setFormData({ ...formData, telegramToken: "" });
      } else if (data?.code === "SUCCESS") {
        const event = new Event("visibilitychange");
        document.dispatchEvent(event);
      }
    },
    onError: () => alert("Something went wrong"),
  });

  return (
    <Modal show={open} onClose={onClose}>
      <Modal.Header>Create a New Enterprize Team</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Name of your Enterprize" />
              </div>
              <TextInput
                id="name"
                placeholder="Enterprize Name"
                required={true}
                value={formData?.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Enterprize Email" />
              </div>
              <TextInput
                id="email"
                type={"email"}
                placeholder="Enterprize Email"
                required={true}
                value={formData?.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="token" value="Telegram Bot Token" />
              </div>
              <TextInput
                id="token"
                type="password"
                required={true}
                value={formData?.telegramToken}
                onChange={(e) =>
                  setFormData({ ...formData, telegramToken: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="accept"
                defaultChecked={false}
                required
                checked={formData?.agree}
                onChange={() =>
                  setFormData({ ...formData, agree: !formData?.agree })
                }
              />
              <Label htmlFor="accept">
                I agree to the Terms and Conditions.
              </Label>
            </div>
            <Button
              type="submit"
              disabled={
                !formData?.agree ||
                isCreating ||
                !formData?.name ||
                !formData?.telegramToken
              }
              onClick={() => sendCreate()}
            >
              Submit
            </Button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreateTeamModal;
